import Property from '@/models/Property';
import connectDB from '@/config/database';

export const GET = async (request) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const location = searchParams.get('location');
    const locationPattern = new RegExp(location, 'i');

    //Construct the mongoose query object
    const query = {
      $or: [
        { name: { $regex: locationPattern } },
        { description: { $regex: locationPattern } },
        { 'location.city': { $regex: locationPattern } },
        { 'location.street': { $regex: locationPattern } },
        { 'location.province': { $regex: locationPattern } }
      ]
    }
    
    //Check if type is NOT 'All'
    const type = searchParams.get('propertyType')
    
    if (type && type !== 'All') {
      const typePattern = new RegExp(type, 'i');
      query.type = {$regex:typePattern}
    }

    const properties = await Property.find(query);
 
    return new Response(JSON.stringify(properties),{status:200})
    
  } catch (error) {
    console.error(error)
    return new Response('Something went wrong', {
      status:500
    })
  }
}