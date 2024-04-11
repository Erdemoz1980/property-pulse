const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

//Fetch all properties
async function fetchProperties() {

  try {
    //Handle the case where the domain is not available yet
    if (!apiDomain) return []
  

    const res = await fetch(`${apiDomain}/properties`, {
     cache:'no-store'
   })

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return await res.json();
    
  } catch (error) {
   console.log(error)
   return []
  }
}

//Fetch single property
async function fetchPropertyDetails(id) {
  try {
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    return await res.json();
    
  } catch (error) {
    console.log(error);
    return null
  }

}

export { fetchProperties, fetchPropertyDetails };
