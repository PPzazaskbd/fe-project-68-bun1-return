interface CardProps {
  vid: string;
  name: string;
  picture: string; // ใช้ string เปล่าแทน undefined
}

export default function Card({ vid, name, picture }: CardProps) {
  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "5px" }}>
      <img src={picture} alt={name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <p>ID: {vid}</p>
      <p>Name: {name}</p>
    </div>
  );
}