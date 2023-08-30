import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}


const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    }
    fetchData()
  }, [])
  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage(`Successful login for ${user.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    console.log('logging out....')
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()  
  }

  const addBlog = async (blogObject) => {
    console.log('adding a blog....')
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      const updatedBlogList = blogs.concat(returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes) 
      setBlogs(updatedBlogList)
      setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    } catch (exception) {
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }  
  }

  const updateBlog = async (id, updatedBlog) => {
    console.log('updating....')
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      const blogToBeUpdated = blogs.find(blog => blog.id.toString() === id)
      const blogAdder = blogToBeUpdated.user
      returnedBlog.user = blogAdder
      const updatedBlogList = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
      updatedBlogList.sort((a, b) => b.likes - a.likes)
      setBlogs(updatedBlogList)
      setSuccessMessage(`blog ${updatedBlog.title} was liked`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    } catch (exception) {
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }  
  }

  const deleteBlog = async (id) => {
    console.log('deleting....')
    const selected = blogs.find(blog => blog.id.toString() === id)
    if (window.confirm(`Remove blog ${selected.title} ?`)) {
      try {
        await blogService.deleteBlog(id)
        setSuccessMessage(`blog ${selected.title} was removed`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
      } catch (exception) {
        setErrorMessage(exception.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
      const isSelected = (selected) => selected.id.toString() !== id
      const updatedBlogLIst = blogs.filter(isSelected)
      setBlogs(updatedBlogLIst)
    } 
  }


  const loginForm = () => (
    
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogFormRef = useRef()

  const blogForm = () => {

    return (
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
    )  
  }

  return (
    <div>

      <h2>blogs</h2>
      <SuccessNotification message={successMessage}/>
      <ErrorNotification message={errorMessage}/>

      {!user && loginForm()}
      {user && 
        <div>
          <p>{user.name} logged in 
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} likeBlog={updateBlog} removeBlog={deleteBlog} />
          )}
        </div>
      } 
    </div>
  )
}

export default App