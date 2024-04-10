import Property from "@/models/Property";
import connectDB from "@/config/database";
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from "@/config/cloudinary";

//GET api/properties
export const GET = async (request) => {
  try {
    await connectDB();
    const properties = await Property.find();
    
    return new Response(JSON.stringify(properties), {
      status: 200
    });

  } catch (error) {
    console.log(error)
    
  }
};

//POST 
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    //Handle the case where there's no userId
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', {
         status:401
       })
    }

    const formData = await request.formData();
    
    //Create propertyData object for database
    const propertyData = {
      owner:sessionUser.userId,
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street:formData.get('location.street'),
        city: formData.get('location.city'),
        province: formData.get('location.province'),
        postalCode:formData.get('location.postalCode')
      },
      beds:formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities: formData.getAll('amenities'),
      rates: {
        nightly: formData.get('rates.nightly'),
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
      },
      seller_info: {
        name:formData.get('seller_info.name'),
        email:formData.get('seller_info.email'),
        phone:formData.get('seller_info.phone'),
      }
    }

    //Make sure images don't contain empty strings, which would cause error for image database
    const images = formData.getAll('images').filter(image=>image.name!=='');

   
    //Upload images to cloudinary
    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      //Convert the image data to base64
      const imageBase64 = imageData.toString('base64');

      //Make request to upload to cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`, {
        folder: 'property_pulse'
      }
      );

      imageUploadPromises.push(result.secure_url);

      //Wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      //Add uploaded images to propertyData object
      propertyData.images = uploadedImages;
    }


    const newProperty = new Property(propertyData);
    await newProperty.save();
  
    return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);

  } catch (error) {
    return new Response('Failed to add property', {
      status:500
    })
  }
}


