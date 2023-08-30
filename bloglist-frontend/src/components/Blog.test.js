import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


describe('togglable blog content', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'Title to test',
      author: 'Author Tester',
      url: 'Url for test purposes',
      likes: 1,
      user: {
        username: 'hkari',
        name: 'Henna Kari'
      }
    }
    const user ={
      username: 'hkari',
      name: 'Henna Kari'
    }

    container = render(
      <Blog blog={blog} user={user}></Blog>
    ).container
  })


  test('renders title but not url', () => {
    const div = container.querySelector('.visibleContent')
    expect(div).toHaveTextContent('Title to test')
    expect(div).not.toHaveTextContent('Url for test purposes')
    expect(div).not.toHaveStyle('display: none')
  })


  test('at start togglable content is not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, togglable content is displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveTextContent('Url for test purposes')
    expect(div).toHaveTextContent('likes')
    expect(div).toHaveTextContent('Henna Kari')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('like button click', () => {
  test('clicking the button twice calls event handler twice', async () => {

    const mockHandler = jest.fn()

    const blog = {
      title: 'Title to test',
      author: 'Author Tester',
      url: 'Url for test purposes',
      likes: 1,
      user: {
        username: 'hkari',
        name: 'Henna Kari'
      }
    }
    const blogUser ={
      username: 'hkari',
      name: 'Henna Kari'
    }

    render(
      <Blog blog={blog} user={blogUser} likeBlog={mockHandler}/>
    )

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('blog form calls event handler with correct data', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const inputTitle = container.querySelector('#title-input')
    const inputAuthor = container.querySelector('#author-input')
    const inputUrl = container.querySelector('#url-input')

    const sendButton = screen.getByText('create')

    await user.type(inputTitle, 'Test title')
    await user.type(inputAuthor, 'Test author')
    await user.type(inputUrl, 'Test url')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test author')
    expect(createBlog.mock.calls[0][0].url).toBe('Test url')
  })
})



