class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  submit(event) {
    event.preventDefault()
    $(event.target).ajaxSubmit({
        success: ()=>{
          this.props.router.push(`/m/`)    
        },
        error: ()=>{
          alert("Wrong email or password")
          this.setState({pass: null})
        }
    });
    return false;
  }
    
  passChange(event) {
    this.setState({pass: event.target.value})
  }

  emailChange(event) {
    this.setState({email: event.target.value})
  }      
  
  render() {
    url = "/users/sign_in.json"
    return (
      <form noValidate="novalidate"  onSubmit={this.submit.bind(this)} encType="multipart/form-data" action={url} acceptCharset="UTF-8" method="post">

        <div className="bar bar-header bar-positive">
          <div className="title title-bold">YarnTale</div>
        </div>

          <div className="content has-header has-footer">

            <div className="item">
              DEMO login: demo@demo.com <br/>
              password: 12345678<br/>
            </div>

            <label className="item item-input item-stacked-label">
              <span className="input-label">Email</span>
              <input type="text" name="user[email]" value={this.state.email || ''} onChange={this.emailChange.bind(this)}/>
            </label>

            <label className="item item-input item-stacked-label">
              <span className="input-label">Password</span>
              <input type="password" name="user[password]" value={this.state.pass || ''} onChange={this.passChange.bind(this)}/>
            </label>
            <input type="hidden" name="user[remember_me]" value="1" />

            <div className="padding">
              <button type="submit" className="button button-block button-positive">
                Log in
              </button>
              
              <a class="button button-clear button-dark" href="/users/sign_up">Register</a>&nbsp;
              
              <a class="button button-clear button-dark" href="/users/password/new">Forgot your password?</a>
            </div>
          </div>

      </form>
    )            
  }

}