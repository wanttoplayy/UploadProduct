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

export async function GET(request: Request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";

    // Modify the query to filter by search term if provided
    const query = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { code: new RegExp(search, "i") },
          ],
        }
      : {};

    const products = await Product.find(query);
    return new Response(JSON.stringify({ success: true, products }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}

// DELETE Method
export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split("/").pop();
    await Product.findByIdAndDelete(productId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}

// PUT Method
export async function PUT(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split("/").pop();
    const updateData = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );
    return new Response(JSON.stringify({ success: true, updatedProduct }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
