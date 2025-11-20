import React from 'react'
import LogIn from '../pages/login'
import { Provider } from 'react-redux'
import store from '../redux/store'

export default function index() {
  return (
    <Provider store={store}>
      <LogIn/>
    </Provider>
  )
}
