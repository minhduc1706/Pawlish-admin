import { AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Link } from 'react-router-dom'

const lowStockProducts = [
  { id: 1, name: "Pet Shampoo", quantity: 3, maxStock: 20, category: "Care" },
  { id: 2, name: "Dog Treats", quantity: 5, maxStock: 30, category: "Food" },
  { id: 3, name: "Cat Chew Toy", quantity: 2, maxStock: 15, category: "Toys" },
]

const DashboardLowStock = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Low Stock Products</CardTitle>
            <CardDescription>Products that need to be restocked</CardDescription>
          </div>
          <Badge variant="destructive" className="flex gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{lowStockProducts.length} products</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No products are running low</p>
          ) : (
            lowStockProducts.map((product) => {
              const stockPercentage = (product.quantity / product.maxStock) * 100
              const isVeryCritical = product.quantity <= 2
              
              return (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <span className={`text-sm font-medium ${isVeryCritical ? "text-red-600" : "text-orange-500"}`}>
                      {product.quantity} / {product.maxStock}
                    </span>
                  </div>
                  
                  <Progress 
                    value={stockPercentage} 
                    className={isVeryCritical ? "bg-red-100" : ""}
                  />
                </div>
              )
            })
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link 
          to="/admin/inventory" 
          className="text-sm text-primary hover:underline"
        >
          View all inventory
        </Link>
      </CardFooter>
    </Card>
  )
}

export default DashboardLowStock
