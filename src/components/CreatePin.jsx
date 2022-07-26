import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'


import { client } from '../client'
import { categories } from '../utils/data'
import Spinner from './Spinner'


export default function CreatePin({user}) {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(null)
  const [fields, setFields] = useState(false)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff' ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const createPin =()=>{
    if(title && about && category && imageAsset?._id){
      const doc ={
        _type:'pin',
        title: title,
        about: about,
        destination: destination && destination,
        category: category,
        image:{
          _type:'image',
          asset:{
            _type:'reference',
            _ref:imageAsset?._id,
          }
        },
        userId:user._id,
        postedBy:{
          _type:'postedBy',
          _ref:user._id,
        }
      }
      client.create(doc).then(()=>{
        navigate('/')
      })
    }else{
      setFields(true)

      setTimeout(() => {
        setFields(false)
      }, 3000);
    }
  }
   
  return (
    <div className='flex flex-col justify-center items-center lg:h-4/5 mt-5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>All fields are required</p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="flex p-3 bg-secondaryColor w-full flex-0.7">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && (<Spinner type='Watch' />)}
            {wrongImageType && (<p className='text-red-500'>Choose valid image</p>)}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className='absolute bottom-3 p-3 right-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:opacity-100 opacity-75 hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-6 lg:pl-5 mt-5 w-full">
            <input 
            type="text"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Title"
            className='outline-none text-xl sm:text-2xl font-bold border-b-2 border-gray-200 p-2'
            />
            {/* {user && (
              <div className="flex gap-2 my-2 items-center rounded-lg bg-white">
                  <img src={user?.image} alt="user-profile" className='w-10 h-10 rounded-full' />
                  <p className='font-bold'>{user?.fullName}</p>
              </div>
            )} */}
            <input 
            type="text"
            value={about}
            onChange={(e)=>setAbout(e.target.value)}
            placeholder="What's your pin about ?"
            className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-2'
            />
            <input 
            type="text"
            value={destination}
            onChange={(e)=>setDestination(e.target.value)}
            placeholder="Destination link"
            className='outline-none text-base sm:text-lg font-bold border-b-2 border-gray-200 p-2'
            />

            <div className="flex flex-col">
                <div>
                  <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose pin category</p>
                </div>
                <select
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 rounded-md p-2 cursor-pointer'
                onChange={(e)=>setCategory(e.target.value)}
                >
                  <option value="Others" className='bg-white'>Select category</option>
                  {categories.map((category)=>(
                    <option value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{category.name}</option>
                  ))}
                </select>
            </div>
            <div className='mt-5 flex justify-end items-end'>
              <button
              type='button'
              onClick={createPin}
              className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Create Pin
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}
