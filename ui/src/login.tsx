import Container from 'react-bootstrap/Container';


export default function LoginForm() {

    return (
      <Container>
      <h1 className="loginTitle">Login</h1>
      <form method="post" id="login-form" action="/admin/login">
      <div className="form-group row">
        <label htmlFor="email" className="col-sm-4 col-form-label">Email</label>
        <div className="col-sm-8">
          <input
            id="email"
            placeholder="Email"
            aria-label="Email"
            type="text"
            name="email"
            required
          />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="password" className="col-sm-4 col-form-label">Password</label>
          <div className="col-sm-8">
            <input
              id="password"
              placeholder="Password"
              aria-label="Password"
              type="password"
              name="password"
              required
            />
          </div>
        </div>
        <br/>
        <div className="form-group row">
        <div className="col-sm-12 login-button">
          <button type="submit" className='btn btn-primary' name="intent" value="login">Login</button>
          </div>
        </div>
      </form>
      <br/>
      <div className="form-group row">
        <div className="col-sm-12 login-button">
      <form method="post" action="/admin/login/oauthstart/google" id="google-login-form">
        <button type="submit">Sign in with Google</button>
      </form>
      </div>
      </div>
    </Container>
    );
  }
  