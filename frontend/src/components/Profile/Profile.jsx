import React, {useState, useEffect} from 'react';
import Modal from "../Elements/Modal"
import Footer from "../Elements/Footer";
import "./Profile.css";
import Header from "components/Header/Header";

const Profile = () => {
    const [profile, setProfile] = useState({
        total_blood: 100,
        attack_power: 10,
        image: null
    });
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [updatedValue, setUpdatedValue] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem('token'); // Retrieve the JWT token
            const response = await fetch(window.location.origin + '/livingstonesapp/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setProfile(data);
        };
        fetchProfile();
    }, []);

    const handleOpenModal = (field) => {
        setModalContent(field);
        setShowModal(true);
    };

    const handleChange = (e) => {
        if (modalContent === 'image' && e.target.files && e.target.files[0]) {
            setUpdatedValue(e.target.files[0]);
        } else {
            setUpdatedValue(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (modalContent && updatedValue) {
            formData.append(modalContent, updatedValue);
        }
        console.log(typeof updatedValue);

        const token = sessionStorage.getItem('token');
        try {
            const response = await fetch(window.location.origin + '/livingstonesapp/profile/update/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            setProfile(data);
            setShowModal(false);
            setUpdatedValue('');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className={"profile-container"}>
            <Header/>
            <div className="profile">
                <h1>戰鬥檔案</h1>
                <div className="profile-item">
                    <label>總血量: {profile.total_blood}</label>
                    <button onClick={() => handleOpenModal('total_blood')}>修改</button>
                </div >
                <div className="profile-item">
                    <label>攻擊力: {profile.attack_power}</label>
                    <button onClick={() => handleOpenModal('attack_power')}>修改</button>
                </div>
                <div className="profile-item">
                    <label>大頭照:</label>
                    {profile.image && <img src={profile.image} alt="Profile" width="100"/>}
                    <button onClick={() => handleOpenModal('image')}>修改</button>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{modalContent === 'image' ? '上傳影像' : '新數值'}:</label>
                        <input
                            type={modalContent === 'image' ? 'file' : 'text'}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">確認</button>
                </form>
            </Modal>
            <Footer/>
        </div>


    );
};

export default Profile;
