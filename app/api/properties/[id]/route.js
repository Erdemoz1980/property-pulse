import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

//GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const property = await Property.findById(params.id);

    if (!property) return new Response('Property Not Found',
      {
        status: 404
      })

    return new Response(JSON.stringify(property), {
      status: 200
    });

  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch data')
  }
};

//DELETE /api/properties/:id
export const DELETE = async (request, {params}) => {
  try {
    const propertyId = params.id;
    
    //Check for session
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User id is required', {
        status:401
      })
    }

    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId)
    if (!property) return new Response('Property not found', { status: 401 });
   
    //Verify ownership
    if (property.owner.toString() !== userId) {
      return new Response('Unauthorized', {status:401})
    }

    await property.deleteOne();
    return new Response('Property deleted',{status:200})

  } catch (error) {
    console.error(error)
    return new Response('Failed to delete property', {
      status: 400
    })
  }
};