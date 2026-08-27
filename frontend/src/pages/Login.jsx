
import {useForm} from "react-hook-form"
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import { login } from "../features/auth/authSlice"

function Login(){

  const navigate=useNavigate()

  const dispatch =useDispatch()
  
  const {loading,error} = useSelector((state)=> state.auth)

  const {register,handleSubmit,formState :{errors},} =useForm();


const onSumbit=(data) =>{
    dispatch(login(data))
  };

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSumbit)}>
        <div>
          <label >Email</label>
          <input type="email" {...register("email",{required:"Email is required"})} />

          {errors.email && (
            <p>{errors.email.message}</p>
          )}

        </div>
        <div>
          <label>Password</label>

          <input
            type="password"
            {...register("password", {
              required: "Password is required",
            })}
          />

          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>
            <button type="submit" disabled={loading}>
              {loading ?  "logging in..." : "login"}
            </button>



      </form>
       {error && (
        <p>
          {error.message || "Login failed."}
        </p>
      )}
      <p>
  Don't have an account?{" "}
  <button onClick={() => navigate("/signup")}>
    Signup
  </button>
</p>

    </div>

  )
  }

export default Login;