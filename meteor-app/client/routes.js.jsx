import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import MobileTales from './components/tales.js.jsx'
import SignIn from './components/sign_in.js.jsx'
import MobileTaleNew from './components/tale_new.js.jsx'
import MobileTaleEdit from './components/tale_edit.js.jsx'
import MobileSlideEdit from './components/slide_edit.js.jsx'

class MobileRoutes extends React.Component {

  render() {
    return(
      <Router history={browserHistory}>
        <Route path="/" component={MobileTales}></Route>
        <Route path="/m/" component={MobileTales}></Route>
        <Route path="/m/sign_in" component={SignIn} />
        <Route path="/m/tales" component={MobileTales} />
        <Route path="/m/tales/new" component={MobileTaleNew} />
        <Route path="/m/tales/:id/edit" component={MobileTaleEdit} />
        <Route path="/m/slides/:id/edit" component={MobileSlideEdit} />
        <Route path="/m/tales/:tale_id/slides/new" component={MobileSlideEdit} />
      </Router>
    )
  }

}



Meteor.startup(() => {

  window.DATA_HOST = "http://localhost:3000"
  window.DATA_HOST = "http://yarntale.cloudspaint.com"
  window.DATA_HOST = "http://192.168.1.108:3000"

  $.ajaxSetup({
      cache: false,
      xhrFields: {
         withCredentials: true
      },
      crossDomain: true
  })

  render((
    <MobileRoutes />
  ), document.getElementById('root'))
})
