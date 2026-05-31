import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import './components.css'

interface createclassForm {
  className: string,
  semester: string,
  section: string,
  description: string
}
const createClass = ({ setcreateclassBox }) => {
  const router = useRouter();
  const [loading, setloading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [form, setForm] = useState<createclassForm>({ className: "", semester: "", section: "", description: "" })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handlecreateClass = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true)
    setError("")
    const res = await fetch("/api/classroom/createclass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data: { message?: string } = await res.json();
    setloading(false)
    if (!res.ok) {
      return setError(data.message || "Try again")
    }
    setcreateclassBox(false)
    router.push('/dashboard/allclasses')
  }

  return (
    <>
      <div className='joincreateClassBg'>
        <div className='joincreateClassBox'>
          {error && (<p className='errorMsg'>{error}</p>)}
          <form onSubmit={handlecreateClass}>
            <input type='text' name='className' placeholder='Class Name' onChange={handleChange} required></input>
            <input type='text' name='semester' placeholder='Semester' onChange={handleChange} required></input>
            <input type='text' name='section' placeholder='Section' onChange={handleChange} required></input>
            <input type='text' name='description' placeholder='Description' onChange={handleChange} required></input>
            <div className='joincreateButtons'>
              <button type='button' onClick={() => { setcreateclassBox(false) }}>⬅️Go BACK</button>
              <button type='submit' disabled={loading}>{loading ? 'Please Wait ..' : '➕CREATE'}</button>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default createClass
