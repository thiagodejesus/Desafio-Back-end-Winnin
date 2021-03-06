import { IPost } from "@src/entities/Post"
import { PostService } from "./PostService"
import { PrismaPostRepository } from "@src/repositories/Post/PrismaPostRepository"
import { IPostRepository } from "@src/repositories/Post/IPostRepository"

describe("Create Posts", () => {
  let postRepository: IPostRepository
  let postService: PostService

  beforeAll(async () => {
    postRepository = new PrismaPostRepository()
    postService = new PostService(postRepository)

    const posts: IPost[] = [
      {
        author: "teste1",
        created_utc: 1620937183, // 2021/05
        num_comments: 121,
        title: "teste",
        ups: 123,
      },
      {
        author: "teste2",
        created_utc: 1615666783, // 2021/03
        num_comments: 124,
        title: "teste",
        ups: 122,
      },
      {
        author: "teste3",
        created_utc: 1597349983, // 2020/08
        num_comments: 124,
        title: "teste",
        ups: 122,
      },
      {
        author: "teste4",
        created_utc: 1628885983, // 2021/08
        num_comments: 100,
        title: "teste",
        ups: 100,
      },
      {
        author: "teste5",
        created_utc: 1626207583, // 2021/07
        num_comments: 200,
        title: "teste",
        ups: 200,
      },
    ]

    await postService.createMany(posts)
  })

  test("should be able to create posts", async () => {
    const posts: IPost[] = [
      {
        author: "teste6",
        created_utc: 1620937183,
        num_comments: 121,
        title: "teste",
        ups: 123,
      },
      {
        author: "teste7",
        created_utc: 1605322799,
        num_comments: 124,
        title: "teste",
        ups: 122,
      },
    ]

    const response = await postService.createMany(posts)

    expect(response).toBeGreaterThanOrEqual(1)
  })

  test("should be able to get all posts ordered in desc by ups", async () => {
    const response = await postService.getAll("ups")

    expect(response[0].ups).toBeGreaterThanOrEqual(response[1].ups)
    expect(response[1].ups).toBeGreaterThanOrEqual(response[2].ups)
    expect(response[2].ups).toBeGreaterThanOrEqual(response[3].ups)
    expect(response[3].ups).toBeGreaterThanOrEqual(response[4].ups)
    expect(response[4].ups).toBeGreaterThanOrEqual(response[5].ups)
  })

  test("should be able to get all posts ordered in desc by comments", async () => {
    const response = await postService.getAll("comments")

    expect(response[0].num_comments).toBeGreaterThanOrEqual(
      response[1].num_comments
    )
    expect(response[1].num_comments).toBeGreaterThanOrEqual(
      response[2].num_comments
    )
    expect(response[2].num_comments).toBeGreaterThanOrEqual(
      response[3].num_comments
    )
    expect(response[3].num_comments).toBeGreaterThanOrEqual(
      response[4].num_comments
    )
    expect(response[4].num_comments).toBeGreaterThanOrEqual(
      response[5].num_comments
    )
  })

  test("should be able to get posts filtered by timestamp and ordered by ups", async () => {
    const response = await postService.getAllInRange(
      "20-08-2020",
      "20-07-2021",
      "ups"
    )

    expect(response[0].ups).toBeGreaterThanOrEqual(response[1].ups)
    expect(response[1].ups).toBeGreaterThanOrEqual(response[2].ups)
    expect(response[2].ups).toBeGreaterThanOrEqual(response[3].ups)
    expect(response[3].ups).toBeGreaterThanOrEqual(response[4].ups)
    expect(response.some(({ created_utc }) => created_utc < 1597349983)).toBe(
      false
    )
    expect(response.some(({ created_utc }) => created_utc > 1626207583)).toBe(
      false
    )
  })
})
