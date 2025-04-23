
/**
 * Hàm tự động cập nhật endDate nếu startDate lớn hơn endDate.
 * @param {string} startDate - Ngày bắt đầu (định dạng chuỗi).
 * @param {string} endDate - Ngày kết thúc (định dạng chuỗi).
 * @param {function} setValue - Hàm để cập nhật giá trị trong form.
 */
export const syncEndDateWithStartDate = (startDate, endDate, setValue) => {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    setValue('endDate', startDate); 
  }
};


export const formatDate = (dateString) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date(dateString).toLocaleDateString(
		undefined,
		options
	);
	const [month, day, year] = formattedDate.split('/');

	return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateString) => {
	const daysOfWeek = [
		'Chủ nhật',
		'Thứ 2',
		'Thứ 3',
		'Thứ 4',
		'Thứ 5',
		'Thứ 6',
		'Thứ 7',
	];
	const date = new Date(dateString);
	const dayOfWeek = daysOfWeek[date.getUTCDay()];
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const year = date.getUTCFullYear();
	const hours = String(date.getUTCHours()).padStart(2, '0');
	const minutes = String(date.getUTCMinutes()).padStart(2, '0');

	const formattedDate = `${dayOfWeek}, ${day}/${month}/${year} ${hours}:${minutes}`;

	return formattedDate;
};



export const formatDateInput = (dateString) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date(dateString).toLocaleDateString(
		undefined,
		options
	);
	const [month, day, year] = formattedDate.split('/');

	return `${year}-${month}-${day}`;
};

export const getCurrentTime = () => {
	const currentTime = new Date();
	const hours = currentTime.getHours();
	const minutes = currentTime.getMinutes();
	let period = 'AM';

	let formattedHours = hours;
	if (formattedHours >= 12) {
		formattedHours = formattedHours % 12;
		period = 'PM';
	}
	if (formattedHours === 0) {
		formattedHours = 12;
	}

	const formattedMinutes = minutes.toString().padStart(2, '0');
	return `${formattedHours}:${formattedMinutes} ${period}`;
};

export const getOneHourLaterTimeString = () => {
	const now = new Date();
	const oneHourLater = new Date(now.getTime() + 3600000);
	const hours = String(oneHourLater.getHours()).padStart(2, '0');
	const minutes = String(oneHourLater.getMinutes()).padStart(2, '0');
	const seconds = String(oneHourLater.getSeconds()).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
};

export const getCurrentTimeString = () => {
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	return `${currentHour.toString().padStart(2, '0')}:${currentMinute
		.toString()
		.padStart(2, '0')}`;
};

export const formatTimerCountDown = (time) => {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time - minutes * 60);

	if (minutes < 10) minutes = '0' + minutes;
	if (seconds < 10) seconds = '0' + seconds;
	return minutes + ':' + seconds;
};

export const validCurrentDate = () => {
	const currentDate = new Date();
	return currentDate.toISOString().slice(0, 10);
};


export const formatTime = (timestamp) => {
	const date = new Date(timestamp);

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatWorkingTime = (time) => {
	const hours = time.split(':')[0];
	const minutes = time.split(':')[1];
	if ((hours == 12 && minutes >= 1) || hours >= 13) {
		return time + ' PM';
	}
	return time + ' AM';
};

export const getDetailMinute = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	return `${minutes} phút ${remainingSeconds} giây`;
};

export const formatDateForumPost = (postDate) => {
	const postDateObj = new Date(postDate);
	const now = new Date();
	const diffInSeconds = Math.floor((now - postDateObj) / 1000);

	if (diffInSeconds < 60) {
		return diffInSeconds + ' giây trước';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return diffInMinutes + ' phút trước';
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return diffInHours + ' giờ trước';
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return diffInDays + ' ngày trước';
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 52) {
		return diffInWeeks + ' tuần trước';
	}

	const diffInYears = Math.floor(diffInWeeks / 52);
	return diffInYears + ' năm trước';
};

export const appendHourToDate = (dateString, hourString) => {
	const date = new Date(dateString);

	const [hours, minutes] = hourString.split(':').map(Number);

	date.setUTCHours(hours, minutes, 0, 0);

	date.setUTCHours(date.getUTCHours() - 7);

	return date.toISOString();
};

export const formatDateDetail = (date) => {
	if (!date) return "";
	const d = new Date(date);
	const year = d.getFullYear();
	const month = `0${d.getMonth() + 1}`.slice(-2);
	const day = `0${d.getDate()}`.slice(-2);
	return `${day}-${month}-${year}`;
}