var Router = window.ReactRouter.Router
var Route = window.ReactRouter.Route
var IndexRoute = window.ReactRouter.IndexRoute
var History = window.ReactRouter.browserHistory
var Link = window.ReactRouter.Link

class MobileRoutes extends React.Component {

  render() {
    return(
      <Router history={History}>
        <Route path="/m" component={MobileTales} />
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

