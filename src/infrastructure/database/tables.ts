export type Db = {
  books: BookTable;
  publishers: PublisherTable;
};

export type BookTable = {
  isbn: string;
  title: string;
  author: string;
  publisher_id: string;
  publish_date: string;
};

export type PublisherTable = {
  id: string;
  name: string;
};
