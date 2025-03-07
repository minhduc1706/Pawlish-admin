import { ShoppingBag, Package, TrendingUp, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const productStats = {
  totalProducts: 124,
  categories: [
    { name: "Food", count: 45, percentage: 36 },
    { name: "Toys", count: 32, percentage: 26 },
    { name: "Care", count: 28, percentage: 23 },
    { name: "Accessories", count: 19, percentage: 15 },
  ],
  topSelling: [
    { name: "Puppy Food", sales: 42 },
    { name: "Flea & Tick Shampoo", sales: 38 },
    { name: "Cat Scratching Toy", sales: 27 },
  ],
  inventoryStatus: {
    inStock: 98,
    lowStock: 18,
    outOfStock: 8,
  },
}

const DashboardProductStats = () => {
  return (
    <Card className="shadow-md h-full my-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Product Statistics</CardTitle>
            <CardDescription>Overview of store products</CardDescription>
          </div>
          <Badge variant="outline" className="flex gap-1">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{productStats.totalProducts} products</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Categories */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Product Categories
            </h3>
            <div className="space-y-3">
              {productStats.categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${category.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Top Selling Products
              </h3>
              <ul className="space-y-2">
                {productStats.topSelling.map((product, index) => (
                  <li key={product.name} className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      {product.name}
                    </span>
                    <Badge variant="secondary">{product.sales}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inventory Status */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                Inventory Status
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <p className="text-lg font-bold text-green-600">{productStats.inventoryStatus.inStock}</p>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <p className="text-lg font-bold text-orange-500">{productStats.inventoryStatus.lowStock}</p>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-md text-center">
                  <p className="text-lg font-bold text-red-500">{productStats.inventoryStatus.outOfStock}</p>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardProductStats
