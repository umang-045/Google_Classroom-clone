import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import './components.css'

interface joinclassForm {
  joinCode: string
}

const joinClass = ({ setjoinclassBox }) => {
  const router = useRouter();
  const [form, setForm] = useState<joinclassForm>({ joinCode: "" });
  const [loading, setloading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handlejoinClass = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);
    setError("");
    const res = await fetch("/api/classroom/joinclass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data: { message?: string } = await res.json()
    setloading(false)
    if (!res.ok) {
      return setError(data.message || "Try again")
    }
    setjoinclassBox(false)
    router.push('/dashboard/allclasses')
  }
  return (
    <>
      <div className='joincreateClassBg'>
        <div className='joincreateClassBox'>
          {error && (<p className='errorMsg'>{error}</p>)}
          <form onSubmit={handlejoinClass}>
            <input type='text' name='joinCode' placeholder='Enter you join-code here.....' minLength={8} onChange={handleChange} required></input>

            <div className="joincreateButtons">
              <button onClick={() => { setjoinclassBox(false) }}>⬅️Go BACK</button>
              <button type='submit' disabled={loading}>{loading ? 'Please Wait ..' : '🔗JOIN'}</button>
            </div>

          </form>

        </div>

      </div>

    </>
  )
}

export default joinClass
