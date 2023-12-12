import dbConnect from "@/utils/dbConnect";
import Product from "@/models/Product";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, code, price, imageUrl } = await request.json();
    if (!name || !code || !price || !imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }
    const product = await Product.create({ name, code, price, imageUrl });
    return new Response(JSON.stringify({ success: true, product }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
