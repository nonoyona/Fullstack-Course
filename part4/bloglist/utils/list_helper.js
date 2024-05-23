const ld = require('lodash');

const dummy = () => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0]);
}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) {
        return undefined;
    }

    const groups = ld.groupBy(blogs, 'author');
    const author = ld.maxBy(Object.keys(groups), key => groups[key].length);

    const blogsCount = groups[author].length;

    return {
        author: author,
        blogs: blogsCount
    };

};

const mostLikes = (blogs) => {

    if (blogs.length === 0) {
        return undefined;
    }

    const groups = ld.groupBy(blogs, 'author');
    const author = ld.maxBy(Object.keys(groups), key => totalLikes(groups[key]));
    const likes = totalLikes(groups[author]);

    return {
        author: author,
        likes: likes
    };

};


module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}