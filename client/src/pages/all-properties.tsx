import { Add } from "@mui/icons-material"
import { useTable } from "@pankod/refine-core"
import { Box, Stack, TextField, Typography, Select, MenuItem } from "@pankod/refine-mui"
import { useNavigate } from "@pankod/refine-react-router-v6"

import { PropertyCard, CustomButton } from "components"
import { useMemo } from "react"

const AllProperties = () => {

  const navigate = useNavigate();

  const {
    tableQueryResult: {data, isLoading, isError},
    //current page
    current,
    //set the page
    setCurrent,
    // change the number of elements on the page
    setPageSize,
    // total page count
    pageCount,
    // for sorting 
    sorter,setSorter,
    // for filtering
    filters,setFilters,

  } = useTable();

  // ?? -> If data? object contains no 'data array' then default to 'empty array'
  const allProperties = data?.data ?? [];

  // finding the current order of the item in the sorter
  const currentPrice = sorter.find((item) => item.field === 'price')?.order;


  // useMemo is executed when value in filters changes
  const currentFilterValues = useMemo(() => {

    // flat map is similar to array
    const logicalFilters = filters.flatMap((item)=>('field' in item ? item : []))

    return {
      title: logicalFilters.find((item) => item.field === 'title')?.value || '',
      propertyType: logicalFilters.find((item) => item.field === 'propertyType')?.value || '',
        }

  }, [filters]);




  const toggleSort = (field: string) => {
    setSorter([{field, order: currentPrice === 'asc' ? 'desc' : 'asc'}]);
  }
  

  if(isLoading) return <Typography>Loading...</Typography>
  if(isError) return <Typography>Error...</Typography>

  return (
    <Box>
      <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Stack direction="column" width="100%">

        <Typography
        fontSize={25}
        fontWeight={700}
        color="#11142d"
        >
          {!allProperties.length ? 'There are no properties' : 'All Properties'}

        </Typography>
        <Box mb={2} mt={3} display="flex" width="84%" justifyContent="space-between" flexWrap="wrap">
          <Box display="flex" gap={2} flexWrap="wrap" mb={{ xs: '20px', sm: 0 }}>
            <CustomButton
              title={`Sort price ${currentPrice === 'asc' ? '↑' : '↓'}`}
              handleClick={ () => toggleSort('price') }
              backgroundColor="#475be8"
              color="#fcfcfc"
            />
            <TextField
              variant="outlined"
              color="info"
              placeholder="Search by title"
              value={currentFilterValues.title}
              onChange={(e) => {
                setFilters([
                  {
                    field: 'title',
                    operator: 'contains',
                    value: e.currentTarget.value ? e.currentTarget.value : undefined
                  }
                ])
              }}
            />
            <Select
              variant="outlined"
              color="info"
              displayEmpty
              required
              inputProps={{ 'area-label': 'Without label'}}
              defaultValue=""
              value={currentFilterValues.propertyType}
              onChange={(e) => {
                setFilters([
                  {
                    field: 'propertyType',
                    operator: 'eq',
                    value: e.target.value
                  }
                ], 'replace') // immediately replace the value once we click
              }}
            >
              <MenuItem value="">All</MenuItem>
              {['Apartment', 'Villa', 'Farmhouse', 'Condos', 'Townhouse', 'Duplex', 'Studio', 'Chalet'].map((type)=>(
                <MenuItem key={type} value={type.toLowerCase()} >{type}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        </Stack>
      </Box>
      <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center">
        <CustomButton
          title="Add Property"
          handleClick={() => navigate("/properties/create")}
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>
      <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {allProperties.map((property)=>(
            <PropertyCard 
              key={property._id}
              id={property._id}
              title={property.title}
              price={property.price}
              location={property.location}
              photo={property.photo}
            />
          ))}
      </Box>
      {allProperties.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev-1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          <Box display={{ xs: 'hidden', sm: 'flex' }} alignItems="center" gap="5px">
            Page{' '}<strong>{current} of {pageCount}</strong>
          </Box>
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev+1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />
          <Select
              variant="outlined"
              color="info"
              displayEmpty
              required
              inputProps={{ 'area-label': 'Without label'}}
              defaultValue={10}
              onChange={(e) => setPageSize(e.target.value ? Number(e.target.value) : 10)}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <MenuItem key={size} value={size}>Show {size}</MenuItem>
              ))}

            </Select>
        </Box>
      )}
    </Box>
  )
}

export default AllProperties