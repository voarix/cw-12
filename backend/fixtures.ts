import mongoose from "mongoose";
import config from "./config";
import User, { generateRefreshToken } from "./models/User";
import Group from "./models/Group";
import Activity from "./models/Activity";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection("activities");
    await db.dropCollection("groups");
    await db.dropCollection("users");
  } catch (error) {
    console.log("Collections were not present, skipping drop");
  }

  const john = new User({
    email: "john@gmail.com",
    password: "123",
    displayName: "John",
    confirmPassword: "123",
    role: "user",
  });

  john.refreshToken = generateRefreshToken(john);
  await john.save();

  const jane = new User({
    email: "jane@gmail.com",
    password: "123",
    displayName: "Jane",
    confirmPassword: "123",
    role: "admin",
  });

  jane.refreshToken = generateRefreshToken(jane);
  await jane.save();

  const bob = new User({
    email: "bob@gmail.com",
    password: "123",
    displayName: "Bob",
    confirmPassword: "123",
    role: "user",
  });

  bob.refreshToken = generateRefreshToken(bob);
  await bob.save();

  const [activity1, activity2, activity3, activity4] = await Activity.create([
    {
      user: john._id,
      title: 'Утренняя пробежка по парку',
      image: 'fixtures/morningRun.jpg',
      description: 'Собираемся у Ала арчи в 7:00.',
      isPublished: true,
    },
    {
      user: john._id,
      title: 'Курс по основам Assembler',
      image: 'fixtures/code.jpg',
      description: 'Больше всего подходит для новичков, самое то чтобы вкатиться в АйТи',
      isPublished: false,
    },
    {
      user: jane._id,
      title: 'Йога на свежем воздухе',
      image: 'fixtures/yoga.jpg',
      description: 'Расслабляющая йога на лужайке, если погода позволит. Коврики свои, но позитивное настроение общее.',
      isPublished: true,
    },
    {
      user: bob._id,
      title: 'Вечер настольных игр',
      image: 'fixtures/game.jpg',
      description: 'Собираемся у меня дома поиграть в Джуманджи, будет увлекательно фыдлоажыа',
      isPublished: true,
    },
  ]);

  await Group.create([
    {
      user: john._id,
      activity: activity1._id,
      participants: [john._id, jane._id, bob._id],
    },
    {
      user: john._id,
      activity: activity2._id,
      participants: [john._id, bob._id],
    },
    {
      user: jane._id,
      activity: activity3._id,
      participants: [jane._id, john._id],
    },
    {
      user: bob._id,
      activity: activity4._id,
      participants: [bob._id],
    },
  ]);

  await db.close();
};

run().catch(console.error);