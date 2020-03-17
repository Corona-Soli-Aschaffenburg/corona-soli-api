import fs from 'fs';
import { Request, Response, Application } from 'express';
import { User } from './entity/User';
import { getRepository } from "typeorm";
import shortid from "shortid";
import ejwt from 'express-jwt';
import jwt from 'jsonwebtoken';

const privateKey = fs.readFileSync('private.key');

export default (app: Application) => {
  const userRepository = getRepository(User);

  app.get('/', async (req: Request, res: Response) => res.json({ "Welcome": true }));

  app.get('/users', async (req: Request, res: Response) => {
    res.json(
      await userRepository
        .createQueryBuilder()
        .select(['nickName', 'latLon', 'description'])
        .where("enabled = :b", { b: true })
      .getRawMany()
    );
  })

  app.post('/request_login', async (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase();
    let user;
    try {
      user = await userRepository.findOneOrFail({ email });
    } catch (e) {
      user = await userRepository.create({ email });
    }

    user.loginHash = shortid.generate();
    await userRepository.save(user);
    return res.json({ loginHash: user.loginHash });
  });

  app.get('/login/:loginHash', async (req: Request, res: Response) => {
    console.log(req.params);
    const loginHash = req.params.loginHash;
    try {
      const user = await userRepository.findOneOrFail({loginHash});
      console.log(user);
      const token = jwt.sign({ email: user.email, nickName: user.nickName }, privateKey);
      user.loginHash = null;
      await userRepository.save(user);
      return res.json({ token });
    } catch (e) {
      return res.sendStatus(401);
    }
  });

  app.get('/user',
    ejwt({ secret: privateKey }),
    async (req: Request, res: Response) => {
      const email = req['user'].email
      try {
        const user = await userRepository.findOneOrFail({ email });
        return res.json(user);
      } catch (e) {
        return res.sendStatus(401);
      }
    }
  );

  app.post('/user/edit',
    ejwt({ secret: privateKey }),
    async (req: Request, res: Response) => {
      const email = req['user'].email
      try {
        const user = await userRepository.findOneOrFail({ email });
        user.nickName = req.body.nickName;
        user.description = req.body.description;
        user.latLon = req.body.latLon;
        if (user.nickName) user.enabled = true;
        await userRepository.save(user);
        return res.json(user);
      } catch (e) {
        return res.sendStatus(401);
      }
    }
  );
}


