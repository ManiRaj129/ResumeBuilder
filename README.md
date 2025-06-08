# ResumeReady

ResumeReady is a full-stack resume-building web application designed to help users craft visually appealing and ATS (Applicant Tracking System) friendly resumes with ease. It provides guidance throughout the resume creation process, simplifying both aesthetics and assets management.

## Features

- **Pre-made Templates**: Start with a resume template instead of a blank page.
- **Form-based Input**: Simple, structured forms for entering resume data.
- **Asset suggestions**: Choose from predefined assets (e.g., Education, Experience) or add custom assets.
- **ATS-Friendly**: Ensures that the final resumes are compatible with Applicant Tracking Systems

## Tech-Stack

- **Frontend:**

  1. React.js
  2. Tailwind CSS
  3. React Router
  4. React Hook Form

- **Backend**
  1.  Database (MongoDB)

## Mini-Assignment 2

- **Frontend Changes:**

  1.  A dashboard that acts as a general homepage, and changes dynamically to user's owned resumes, templates and assets.
  2.  'View more' pages for resumes, templates, and assets that contain custom filter options for ease of viewing.
  3.  A resume creation page, where the left panel allows users to design their resumes, with the right panel showing a preview of said resume (updated in real-time).
  4.  Login and SingUp features
  5.  Email Verification page
  6.  Side panel on dashboard with list of account modification, such as password,and email changes, options.
  7.  Pre-Resume creation processes, like template selction and Asset selection.

- **Mock API Plans:**
  We will use all four request types as follow: <br/>
  Get Request: To validate user login, To fetch details on shops pages, dashboard, user owned resources.<br/>
  Post: To facilitate signup, and To save/create resumes<br/>
  Put: For User detail changes, and Saved resume updates<br/>
  Delete: To delete saved resumes, and to facilitate account delete feature.<br/>

- **Request structures:**
  We follow the standard resquest structure with mostly json as content type across all our requests.<br/>

  Example:<br/>

  Header:<br/>
  Request Type<br/>
  Content-type (mosty application/json)<br/>

  Body:<br/>
  JSON (Mostly)<br/>
  Base 64 encode for images within json
