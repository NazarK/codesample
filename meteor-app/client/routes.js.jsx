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
  console.log("meteor.startup")

  window.DATA_HOST = "http://yarntale.cloudspaint.com"
  if(location.host == "localhost:8080") {
    window.DATA_HOST = "http://localhost:3000"
  }
  //window.DATA_HOST = "http://10.0.2.2:3000" //for android emulator

  console.log("using DATA_HOST", DATA_HOST)


  window.AUTH_PARAMS = () => {
    return {
      "user_email": localStorage['user_email'],
      "user_token": localStorage['user_token']
    }
  }


  $.ajaxSetup({
      cache: false,
      crossDomain: true,
      beforeSend: () => {
        $("#ajax-overlay").show()
      },
      complete: () => {
        $("#ajax-overlay").hide()
      },
      error: (resp) => {
        console.log("fail",resp)
        if(resp.status==400) {
          if(resp.responseJSON.error) {
            alert(resp.responseJSON.error)
          }
        }
        if(resp.status==401) {
          console.log("unauthorized, redirecting to sign in")
          browserHistory.push("/m/sign_in")
        }
      }
  })

  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      if(options.type.toUpperCase() === "GET")
          options.data = $.param($.extend(originalOptions.data, AUTH_PARAMS()));
  });

  render((
    <MobileRoutes />
  ), document.getElementById('root'))

})
