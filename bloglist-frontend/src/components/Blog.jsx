import { useState, useImperativeHandle, forwardRef } from 'react'

const Blog = ({ blog }) => {

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

  return (
    <div style={blogStyle}>
      <div style={hideWhenExpanded}>
        {blog.title}
        <button onClick={toggleExpanded}>view</button>
      </div>
      <div style={showWhenExpanded}>
        <div>{blog.title} {blog.author} <button onClick={toggleExpanded}>hide</button></div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes}<button>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div> 
  ) 
}

export default Blog