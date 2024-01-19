import { useState } from 'react'
import Nav from '../components/Nav'


const OnBoarding = () => {


    const handleSubmit = () => {
        console.log('submitted');
    }

    const handleChange = () => {
        console.log('change');
    }


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
                            value={""}
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
                                value={""}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_month"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={""}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                id="dob_year"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={""}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div>


                            <input
                                type="radio"
                                id="man-gender-identity"
                                name="gender_identity"
                                value={"man"}
                                onChange={handleChange}
                                checked={false}
                            />

                            <label htmlFor="man-gender-identity">Man</label>

                            <input
                                type="radio"
                                id="woman-gender-identity"
                                name="gender_identity"
                                value={"woman"}
                                onChange={handleChange}
                                checked={false}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>

                            <input
                                type="radio"
                                id="other-gender-identity"
                                name="gender_identity"
                                value={"other"}
                                onChange={handleChange}
                                checked={false}
                            />
                            <label htmlFor="other-gender-identity">Other</label>
                        </div>

                        <label htmlFor="show-gender">Show my gender on my profile </label>
                        <input
                            type="checkbox"
                            id="show-gender"
                            name="show-gender"
                            onChange={handleChange}
                            checked={false}

                        />

                        <label>Show me</label>
                        <div>
                            <input
                                type="radio"
                                id="man-gender-interest"
                                name="gender_interest"
                                value={"man"}
                                onChange={handleChange}
                                checked={false}
                            />

                            <label htmlFor="man-gender-interest">Man</label>

                            <input
                                type="radio"
                                id="woman-gender-interest"
                                name="gender_interest"
                                value={"woman"}
                                onChange={handleChange}
                                checked={false}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>

                            <input
                                type="radio"
                                id="everyone-gender-interest"
                                name="gender_interest"
                                value={"everyone"}
                                onChange={handleChange}
                                checked={false}
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
                            value={""}
                            onChange={handleChange}
                        />
                        <input type="submit" />
                    </section>


                    <section>

                        <label htmlFor="url">Profile profile</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            onChange={handleChange}
                            required={true}
                        />
                        <div>

                        </div>

                    </section>

                </form>

            </div>
        </>
    )
}

export default OnBoarding