import React, {useState, useEffect} from 'react';
import Modal from "../Elements/Modal"
import Footer from "../Elements/Footer";

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
        <div>
            <div className="profile-container">
                <h1>My Profile</h1>
                <div>
                    <label>Total Blood: {profile.total_blood}</label>
                    <button onClick={() => handleOpenModal('total_blood')}>Change</button>
                </div>
                <div>
                    <label>Attack Power: {profile.attack_power}</label>
                    <button onClick={() => handleOpenModal('attack_power')}>Change</button>
                </div>
                <div>
                    <label>Profile Image:</label>
                    {profile.image && <img src={profile.image} alt="Profile" width="100"/>}
                    <button onClick={() => handleOpenModal('image')}>Change</button>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>{modalContent === 'image' ? 'Upload Image' : 'New Value'}:</label>
                        <input
                            type={modalContent === 'image' ? 'file' : 'text'}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Update</button>
                </form>
            </Modal>
            <Footer/>
        </div>


    );
};

export default Profile;
