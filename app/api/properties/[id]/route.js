import connectDB from "@/config/database";
import Property from "@/models/Property";

//GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
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