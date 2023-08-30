import { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {

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

  

  const handleLikeClick = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    likeBlog(event.target.value,{
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    })
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenExpanded}>
        {blog.title}
        <button onClick={toggleExpanded}>view</button>
      </div>
      <div style={showWhenExpanded}>
        <div>{blog.title} {blog.author} <button onClick={toggleExpanded}>hide</button></div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes}<button value={blog.id} onClick={handleLikeClick}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div> 
  ) 
}

export default Blog