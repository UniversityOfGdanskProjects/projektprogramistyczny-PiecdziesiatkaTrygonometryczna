import { useState } from 'react'
import Nav from '../components/Nav'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const OnBoarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: '',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        show_gender: 'false',
        gender_identity: 'man',
        gender_interest: 'woman',
        url: '',
        about: '',
        matches: []
    })
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.first_name || !formData.dob_day || !formData.dob_month || !formData.dob_year || !formData.url) {
          console.error('Wypełnij wszystkie pola formularza.');
          return;
        }
    
        const dobDate = new Date(`${formData.dob_month}/${formData.dob_day}/${formData.dob_year}`);
        if (isNaN(dobDate.getTime())) {
          console.error('Podano nieprawidłową datę urodzenia.');
          return;
        }
    
        try {
          const response = await axios.put('http://localhost:8000/user', { formData });
          const success = response.status === 200;
          console.log(response);
    
          if (success) {
            navigate('/dashboard');
          }
        } catch (err) {
          console.error(err);
        }
      };
    

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        const name = e.target.name


        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    console.log(formData);


    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => { }}
                showModal={false}
            />
            <div>
                <h2>create account</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="first name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div>
                            <input
                                type="number"
                                id="dob_day"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_month"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_year"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender:</label>
                        <div>


                            <input
                                type="radio"
                                id="man-gender-identity"
                                name="gender_identity"
                                value={"man"}
                                onChange={handleChange}
                                checked={formData.gender_identity === 'man'}
                            />

                            <label htmlFor="man-gender-identity">Man</label>

                            <input
                                type="radio"
                                id="woman-gender-identity"
                                name="gender_identity"
                                value={"woman"}
                                onChange={handleChange}
                                checked={formData.gender_identity === 'woman'}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>

                            <input
                                type="radio"
                                id="other-gender-identity"
                                name="gender_identity"
                                value={"other"}
                                onChange={handleChange}
                                checked={formData.gender_identity === 'other'}
                            />
                            <label htmlFor="other-gender-identity">Other</label>
                        </div>

                        <label htmlFor="show-gender">Show my gender on my profile:</label>
                        <input
                            type="checkbox"
                            id="show-gender"
                            name="show-gender"
                            onChange={handleChange}
                            checked={formData.show_gender}

                        />

                        <label>Show me:</label>
                        <div>
                            <input
                                type="radio"
                                id="man-gender-interest"
                                name="gender_interest"
                                value={"man"}
                                onChange={handleChange}
                                checked={formData.gender_interest === 'man'}
                            />

                            <label htmlFor="man-gender-interest">Man</label>

                            <input
                                type="radio"
                                id="woman-gender-interest"
                                name="gender_interest"
                                value={"woman"}
                                onChange={handleChange}
                                checked={formData.gender_interest === 'woman'}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>

                            <input
                                type="radio"
                                id="everyone-gender-interest"
                                name="gender_interest"
                                value={"everyone"}
                                onChange={handleChange}
                                checked={formData.gender_interest === 'everyone'}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>
                        </div>


                        <label htmlFor="about">About me </label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="siema"
                            value={formData.about}
                            onChange={handleChange}
                        />
                        <input type="submit" />
                    </section>


                    <section>

                        <label htmlFor="url">Profile picture</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div>
                            {formData.url && <img className="profile-pic" src={formData.url} alt="profile pic preview"/>}
                        </div>

                    </section>

                </form>

            </div>
        </>
    )
}

export default OnBoarding