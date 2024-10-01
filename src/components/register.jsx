import Form from "../common/form";
import Joi from "joi";

class Register extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {},
  };

  schema = Joi.object({
    username: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
      .label("Email"),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .label("Password"),

    name: Joi.string().required().label("Name"),
  });

  doSubmit = () => {
    console.log("submitted");
  };

  render() {
    return (
      <main className="container">
        <form onSubmit={this.handleSubmit}>
          <h2>Register</h2>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}

          {this.renderButton("Register")}
        </form>
      </main>
    );
  }
}

export default Register;
