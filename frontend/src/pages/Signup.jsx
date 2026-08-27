import {useNavigate} from "react-router-dom"

import { useForm,useWatch } from "react-hook-form"

function Signup(){

  const navigate=useNavigate()

  const {register,
    handleSubmit,
    control,
    formState : {errors},
  } = useForm()

  const password =useWatch({
    control,name : "password",
  })

  const onSubmit = async (data) =>{

    try {

      const response = await fetch( "http://127.0.0.1:8000/api/auth/signup/",
        {
          method:"POST",
          headers : {
            "Content-Type":"application/json"
          },
          body : JSON.stringify({
            username:data.username,
            email:data.email,
            password:data.password,

          }),

        }
      );

      const result = await response.json();

      if (!response.ok){
        console.log(result);
        return;
      }

      alert("Account created successfully.");

      navigate("/login")


    } catch (error){
      console.error("Signup error :",error)
    }
  };

  return (

    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label >Username</label>
        <input type="text" {...register("username", {
          required : "username is required"
        })} />

        {errors.username && (
          <p>{errors.username.message}</p>
        )}
      </div>

      <div>
        <label >Email</label>\
        <input type="email" {...register("email",{required : "username is required"})} />

        {errors.email && (
          <p>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
          <label>Password</label>

          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit">
          Create Account
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </p>

    </div>


  )
}

export default Signup;  
