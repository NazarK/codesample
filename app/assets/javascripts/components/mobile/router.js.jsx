var Router = window.ReactRouter.Router
var Route = window.ReactRouter.Route
var IndexRoute = window.ReactRouter.IndexRoute
var History = window.ReactRouter.browserHistory
var Link = window.ReactRouter.Link

class MobileRoutes extends React.Component {

  render() {
    return(
      <Router history={History}>
        <Route path="/test" component={MobileTales}>
        </Route>
      </Router>
    )
  }


}

