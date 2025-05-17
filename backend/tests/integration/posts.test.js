const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { app, startServer } = require("../../server"); // Import app
const Post = require("../../src/models/Post");

let mongod;
let serverInstance; // To hold the started server

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI_TEST = uri; // Override for this test suite
  process.env.NODE_ENV = "test"; // Ensure server knows it's test mode

  // Connect mongoose to the in-memory server for this test suite
  await mongoose.connect(uri);
  // Start the actual Express server for Supertest to hit
  // serverInstance = app.listen(0); // Listen on a random available port
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
  // if (serverInstance) {
  //   serverInstance.close(); // Close the server if it was started
  // }
});

beforeEach(async () => {
  // Clears the database between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe("Post API Routes", () => {
  describe("POST /api/posts", () => {
    it("should create a new post and return 201", async () => {
      const newPost = { title: "Test Post", content: "This is test content." };
      const response = await request(app) // Use the imported app directly
        .post("/api/posts")
        .send(newPost)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body).toHaveProperty("_id");

      const postInDb = await Post.findById(response.body._id);
      expect(postInDb).not.toBeNull();
      expect(postInDb.title).toBe(newPost.title);
    });

    it("should return 400 if title is missing", async () => {
      const newPost = { content: "This is test content." };
      const response = await request(app)
        .post("/api/posts")
        .send(newPost)
        .expect(400);
      expect(response.body.message).toContain("Title and content are required");
    });
  });

  describe("GET /api/posts", () => {
    it("should return an array of posts", async () => {
      await Post.create({ title: "Post 1", content: "Content 1" });
      await Post.create({ title: "Post 2", content: "Content 2" });

      const response = await request(app)
        .get("/api/posts")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Post 2"); // Sorted by createdAt desc
    });

    it("should return an empty array if no posts", async () => {
      const response = await request(app).get("/api/posts").expect(200);
      expect(response.body).toEqual([]);
    });
  });
});
