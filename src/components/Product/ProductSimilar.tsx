import Link from "next/link";

// type
import { Product } from "@prisma/client";

// common-component
import Photo from "@src/components/common/Photo";

const ProductSimilar = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <a className="group focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-4 focus:rounded-md">
        <div className="overflow-hidden rounded-md">
          <Photo
            photo={product.image}
            className="h-56 w-full group-hover:scale-105 duration-500"
          />
        </div>
        <h3 className="text-gray-700 mt-2 group-hover:underline underline-offset-2 decoration-orange-500 decoration-2">
          {product.name}
        </h3>
        <p className="text-gray-900 font-semibold group-hover:underline underline-offset-2 decoration-orange-500 decoration-2">
          {product.price}원
        </p>
      </a>
    </Link>
  );
};

export default ProductSimilar;
