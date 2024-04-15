"use client";
import { useState, usEffect, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchForm from '@/components/PropertySearchForm';
import Spinner from '@/components/Spinner';

const SearchResultsPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const location = searchParams.get('location');
  const propertyType = searchParams.get('propertyType');

  useEffect(() => {

    const fetchSearchResults = async () => {
      try {
        const res = await fetch(`/api/properties/search?location=${location}&propertyType=${propertyType}`);
       
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          setProperties([])
        }

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
    
  }, [location, propertyType]);


  return loading ? <Spinner loading={loading} /> : (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto px-4 py-6">
          <Link href='/properties' className='flex-items-center text-blue-500 hover:underline mb-4'>
            <FaArrowAltCircleLeft className='mr-2 mb-1 inline-block' />
            Back to Properties
          </Link>
          <h1 className="text-2xl mb-6">Search Results</h1>
          {properties?.length === 0 ? (
            <p>No properties found</p>
          ) : (<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties?.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>)}
       
        </div>
      </section>
    </>
  )
}

export default SearchResultsPage