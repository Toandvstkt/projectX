import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { AiOutlineClose } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { rules } from "../../utils/rules";
import { getAllAccounts, login, reset } from "../../features/auth/authSlice";
import { Spinner } from "../../components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { errorStyle } from "../../utils/toast-customize";

export const LoginPage = ({ isOpenLoginForm, setIsOpenLoginForm }) => {
  const [accounts, setAccounts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
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
    console.log("Dữ liệu gửi đi:", data); 
    try {
      const response = await dispatch(login(data));

      if (response.type.endsWith('fulfilled')) {
        toast.success('Đăng nhập thành công!');
        const user = JSON.parse(localStorage.getItem('account') || '{}');
        if (user && user.role === 'Giáo viên') {
          navigate('/teacher');
        } else {
          navigate('/home');
        }
      } else {
        toast.error('Sai thông tin đăng nhập!');
      }
    } catch (error) {
      toast.error('Lỗi hệ thống khi đăng nhập!');
    }
  };
  const initiateAllAccounts = async () => {
    const response = await dispatch(getAllAccounts());
    setAccounts(response.payload);
  };

  useEffect(() => {
    initiateAllAccounts();
  }, []);

  useEffect(() => {
    if (isError && message === "Tên đăng nhập hoặc mật khẩu không đúng") {
      toast.error(message, errorStyle);
    }
    dispatch(reset());
  }, [account, isError, isSuccess, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
        <div className="login-page-container flex justify-center items-center bg-primary min-h-screen">
          <div className="w-[90%] login-containe">
          <div className="text-center mb-4 ">
            <img src="/image/logo.svg" alt="Project X Logo" className="mx-auto w-full md:w-[70%]  h-auto" />
            <p className="text-gray-500 mb-[10vh] text-2xl text-white">take tests your way</p>
          </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full md:w-[70%]">
              <div className="mb-3 mt-5">
                <p className="text-3xl text-white  text-center">UserID</p>
                <input
                  type="text"
                  className="rounded-md p-1 my-1 h-[7vh] text-lg focus:outline-none w-full"
                  {...register("userId", { required: "Vui lòng nhập userId" })}
                />
                {errors.userId && <p className="text-red text-xs h-2">{errors.userId.message}</p>}
              </div>
              <div className="mb-4">
                <p className="text-3xl text-white  text-center">Password</p>
                <input
                  type="password"
                  className="rounded-md p-1 my-1 h-[7vh] text-lg focus:outline-none w-full"
                  {...register("password", rules.password)}
                />
                {errors.password ? (
                  <p className="text-red text-xs h-2">{errors.password.message}</p>
                ) : (
                  <p className="h-2"></p>
                )}
              </div>
              <button type="submit" className="block bg-pink text-white text-center rounded-md p-2 font-medium mb-1">
                <p className="text-2xl">Login</p>
              </button>
              <Link to="/register">
                <button className="block border-2 border-pink text-pink text-center rounded-md p-2 font-medium w-full">
                  <p className="text-2xl">Register</p>
                </button>
              </Link>
            </form>
          </div>
        </div>
    </>
  );
  
};
