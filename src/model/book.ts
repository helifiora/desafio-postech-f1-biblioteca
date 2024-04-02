export class Book {
  constructor(
    readonly isbn: string,
    readonly title: string,
    readonly author: string,
    readonly publisherId: string,
    readonly publishDate: Date
  ) {}
}
