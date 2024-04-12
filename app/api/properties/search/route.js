import connectDB from '@/config/database';
import Property from '@/models/Property';


//GET /api/search
export const GET = async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');

    const locationPattern = new RegExp(location, 'i');
     
    //Match location pattern against database fields
    let query = {
      $or: [
        { name: locationPattern },
        { description: locationPattern },
        { 'location.street': locationPattern },
        { 'location.city': locationPattern },
        { 'location.province': locationPattern },
        { 'location.postalCode': locationPattern }
      ]
    };

    //Only check for property if it's not 'All'
    if (propertyType && propertyType !== 'All') {
      const typePattern = new RegExp(propertyType, 'i');
      query.type = typePattern
    }

    //Get the search results
    const properties = await Property.find(query)
  

    return new Response(JSON.stringify(properties),
    {status:200})

    
  } catch (err) {
    console.log(err);
    return new Response('Something went wrong',{
      status:500
    })
    
  }
}