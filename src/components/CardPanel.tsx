/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "./Card"
import getVenues from "@/libs/getVenues"
import { VenueJson } from "../interface"; 

interface CardPanelProps {
  venueJson: VenueJson; 
}

export default async function CardPanel(){

  const venueJson = await getVenues()

  return(

    <div className="grid grid-cols-3 gap-8 mt-6 justify-items-center">

      {
        venueJson.data.map((item: any)=>(
          <Card
            key={item.id}
            vid={item.id}
            name={item.name}
            picture={item.picture}
          />
        ))
      }

    </div>

  )
}