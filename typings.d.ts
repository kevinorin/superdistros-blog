export interface Post {
    _id: string;
    _createdAt: string;
    title: string;
    comments?: Comment[];
    description: string;
    mainImage?: {
        asset: {
            _ref: string;
            _type: string;
        };
    };
    slug: {
        current: string;
    };
    author: {
        name: string;
        image?: {
            asset: {
                _ref: string;
                _type: string;
            };
        };
    };
    body: [object];
}
export interface Comment {
    approved: boolean;
    comment: string;
    email: string;
    name: string;
    post: {
        _ref: string;
        _type: string;
    };
    _id: string;
    _createdAt: string;
    _rev: string;
    _type: string;
    _updatedAt: string;
}
