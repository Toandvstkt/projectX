import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { AiOutlineClose } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser, reset } from "../../features/auth/authSlice";
import { Spinner } from "../../components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { errorStyle } from "../../utils/toast-customize";

export const RegisterPage = ({ setIsOpenRegisterForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const [isPC, setIsPC] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsPC(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.role = "Học viên"; // Role mặc định
    const response = await dispatch(registerUser(data));
    if (response.type.endsWith("fulfilled")) {
      toast.success("Account registered successfully!");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message, errorStyle);
    }
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isPC ? (
        <div className="popup active">
          <div className="overlay"></div>
          <div className="content w-[90%] md:w-[50%] register-container md:m-auto rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AiOutlineClose className="absolute text-sm hover:cursor-pointer" onClick={() => setIsOpenRegisterForm(false)} />
              <h5 className="text-center font-bold mb-3 text-lg">Register</h5>
              <hr />

              {/* Họ và Tên */}
              <div className="mb-3 mt-5">
                <p className="text-sm">Name</p>
                <input type="text" className="border border-gray-500 rounded-md p-1 my-1 text-sm focus:outline-none" 
                  {...register("name", { required: "Please enter your name" })}
                />
                {errors.name && <p className="text-red text-xs h-2">{errors.name.message}</p>}
              </div>

              {/* Mã học viên (userId) */}
              <div className="mb-3">
                <p className="text-sm">Student ID</p>
                <input type="text" className="border border-gray-500 rounded-md p-1 my-1 text-sm focus:outline-none"
                  {...register("userId", { 
                    required: "Please enter your student ID",
                    pattern: { value: /^ptc-\d{4}$/, message: "Student ID is ptc-xxxx" } 
                  })}
                />
                {errors.userId && <p className="text-red text-xs h-2">{errors.userId.message}</p>}
              </div>

              {/* Lớp */}
              <div className="mb-3">
                <p className="text-sm">Class</p>
                <input type="text" className="border border-gray-500 rounded-md p-1 my-1 text-sm focus:outline-none" 
                  {...register("class", { required: "Please enter your class" })}
                />
                {errors.class && <p className="text-red text-xs h-2">{errors.class.message}</p>}
              </div>

              {/* Ngày sinh */}
              <div className="mb-3 mt-5">
                <p className="text-sm">Date of birth</p>
                <input type="date" className="border border-gray-500 rounded-md p-1 my-1 text-sm focus:outline-none"
                  {...register("dob", { required: "Please choose date of birth" })}
                />
                {errors.dob && <p className="text-red text-xs h-2">{errors.dob.message}</p>}
              </div>

              {/* Mật khẩu */}
              <div className="mb-3 mt-5">
                <p className="text-sm">Password</p>
                <input type="password" className="border border-gray-500 rounded-md p-1 my-1 text-sm focus:outline-none" 
                  {...register("password", { 
                    required: "Please enter your password", 
                    minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }
                  })}
                />
                {errors.password && <p className="text-red text-xs h-2">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1">
                Register
              </button>
              <Link to="/login"><p className="text-center text-sm">Đã có tài khoản? Đăng nhập</p></Link>
            </form>
          </div>
        </div>
      ) : (
        <div className="register-container flex justify-center items-center bg-primary min-h-screen">
          <div className="w-[90%] login-containe">
          <div className="text-center mb-4 w-[90vw] ">
            <img src="/image/logo.svg" alt="Project X Logo" className="mx-auto w-full h-auto" />
            <p className="text-gray-500 mb-[10vh] text-2xl text-white">take tests your way</p>
          </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white text-center">Full name</p>
                <input type="text" className="rounded-md p-1 my-1 h-[5vh] text-sm focus:outline-none w-full" 
                  {...register("name", { required: "Please enter your name" })}
                />
                {errors.studentId && <p className="text-red text-xs h-2">{errors.username.message}</p>}
              </div>
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white text-center">Student ID</p>
                <input type="text" className="rounded-md p-1 my-1 h-[5vh] text-sm focus:outline-none w-full"
                  {...register("userId", { 
                    required: "Please enter your student ID",
                    pattern: { value: /^ptc-\d{4}$/, message: "Student ID is ptc-xxxx" } 
                  })}
                />
                {errors.userId && <p className="text-red text-xs h-2">{errors.userId.message}</p>}
              </div>
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white text-center">Class</p>
                <input type="text" className="rounded-md p-1 my-1 h-[5vh] text-sm focus:outline-none w-full" 
                  {...register("class", { required: "Please enter your class" })}
                />
                {errors.class && <p className="text-red text-xs h-2">{errors.class.message}</p>}
              </div>
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white text-center">Date of birth</p>
                <input type="date" className="rounded-md p-1 my-1 h-[5vh] text-sm focus:outline-none w-full"
                  {...register("dob", { required: "Please choose date of birth" })}
                />
                {errors.dob && <p className="text-red text-xs h-2">{errors.dob.message}</p>}
              </div>

              {/* Mật khẩu */}
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white text-center">Password</p>
                <input type="password" className="rounded-md p-1 my-1 h-[5vh] text-sm focus:outline-none w-full" 
                  {...register("password", { 
                    required: "Please enter your password", 
                    minLength: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" }
                  })}
                />
                {errors.password && <p className="text-red text-xs h-2">{errors.password.message}</p>}
              </div>
              <button type="submit" className="block bg-pink text-white text-center rounded-md p-2 font-medium mb-1">
                <p class="text-2xl">Register</p>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
