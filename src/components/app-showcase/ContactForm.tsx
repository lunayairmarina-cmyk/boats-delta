import React from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>How can we help?</h2>
                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Name</label>
                        <input type="text" className={styles.input} placeholder="Your Full Name" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email</label>
                        <input type="email" className={styles.input} placeholder="email@example.com" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Phone</label>
                        <input type="tel" className={styles.input} placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>How did you hear about us?</label>
                        <select className={styles.select}>
                            <option>Social Media</option>
                            <option>Search Engine</option>
                            <option>Referral</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Message</label>
                        <textarea className={styles.textarea} placeholder="Tell us about your needs..."></textarea>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" className={styles.checkbox} id="privacy" />
                        <label htmlFor="privacy" className={styles.checkboxLabel}>
                            I agree to the Privacy Policy and consent to being contacted regarding my inquiry.
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>Send Message</button>
                </form>
            </div>
        </section>
    );
}
