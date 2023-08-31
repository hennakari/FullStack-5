import { useState } from 'react'
//import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [expanded, setExpanded] = useState(false)


  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  let displayRemove = { display: 'none' }

  if (user.username === blog.user.username) {
    displayRemove = { display: '' }
  }


  const handleLikeClick = (event) => {
    event.preventDefault()
    likeBlog(event.target.value,{
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    })
  }

  const handleRemoveClick = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    removeBlog(event.target.value)
  }

  return (
    <div className='blog' style={blogStyle}>
      <div style={hideWhenExpanded} className="visibleContent">
        {blog.title} {blog.author} <button value={blog.id} onClick={toggleExpanded}>view</button>
      </div>
      <div style={showWhenExpanded} className="togglableContent">
        <div>{blog.title} {blog.author} <button onClick={toggleExpanded}>hide</button></div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes}<button className="likeButton" value={blog.id} onClick={handleLikeClick}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={displayRemove}><button value={blog.id} onClick={handleRemoveClick}>remove</button></div>
      </div>
    </div>
  )
}

/* Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
} */

export default Blog