export type Comment = {
	_id: String;
	username: String;
	comments: String;
	rating: Number;
	createdAt: String;
	updatedAt: String;
	__v: Number;
};

export type Product = {
	_id: String;
	productName: String;
	productImg: String;
	productPrice: Number;
	productDescription: String;
	rating: Number;
	comments: Comment;
	createdAt: String;
	updatedAt: String;
	__v: Number;
};
