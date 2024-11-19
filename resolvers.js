const knex = require("../database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const resolvers = {
  Query: {
    async getUserPosts(_, args) {
      try {
        const data = await knex("posts")
          .join("usersWithPosts", "posts.userId", "usersWithPosts.id")
          .where("usersWithPosts.id", args.id)
          .select(
            "usersWithPosts.id as userId",
            "usersWithPosts.name",
            "usersWithPosts.email",
            "posts.id as postId",
            "posts.title",
            "posts.content"
          );
        // console.log(data);
        const userWithPosts = {
          id: data[0]?.userId, // Assumes all posts are for the same user
          name: data[0]?.name,
          email: data[0]?.email,
          posts: data.map((post) => ({
            id: post.postId,
            title: post.title,
            content: post.content,
          })),
        };
        return [userWithPosts];
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    async insertPost(parent, { input }) {
      try {
        console.log(parent);
        const { title, content, userId } = input;
        console.log("datainput", input);
        const data = await knex("posts")
          .insert({ title: title, content: content, userId: userId })
          .returning("*");
        console.log("data", data);
        return data[0];
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async registrationUPosts(parent, { input }) {
      try {
        console.log(parent);
        const { name, email, password } = input;
        console.log(input);
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = await knex("usersWithPosts")
          .insert({ name: name, email: email, password: hashedPassword })
          .returning("*");
        return data;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    async loginUPosts(_, { input }) {
      try {
        const { email, password } = input;
        const verification = await knex("usersWithPosts")
          .where({ email: email })
          .first();
        if (verification) {
          const isValid = await bcrypt.compare(
            password,
            verification["password"]
          );
          if (isValid) {
            const token = jwt.sign(
              { id: verification["id"] },
              process.env.SECRET
            );
            return data;
          }
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
  },
  // UP: {
  //   posts: async (parent) => {
  //     const a = await knex("posts").where({ userId: parent.id });
  //     console.log("hello", a);
  //     return a;
  //   },
  // },
};

module.exports = resolvers;
