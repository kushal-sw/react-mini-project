import { useState } from "react";
import { useCommunityStore } from "@/store/communityStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const DIET_OPTIONS = ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Keto"];

export default function RecipeSubmitForm() {
  const { addRecipe } = useCommunityStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    prepTime: "",
    servings: "",
    imageUrl: "",
    dietaryTags: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.ingredients.trim()) newErrors.ingredients = "Ingredients are required";
    if (!formData.instructions.trim()) newErrors.instructions = "Instructions are required";
    if (!formData.prepTime || Number(formData.prepTime) < 1) newErrors.prepTime = "Valid prep time is required";
    if (!formData.servings || Number(formData.servings) < 1) newErrors.servings = "Valid servings is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newRecipe = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      ingredients: formData.ingredients.split("\n").map(s => s.trim()).filter(Boolean),
      instructions: formData.instructions.split("\n").map(s => s.trim()).filter(Boolean),
      prepTime: Number(formData.prepTime),
      servings: Number(formData.servings),
      dietaryTags: formData.dietaryTags,
      imageUrl: formData.imageUrl.trim() || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800",
      submittedAt: new Date().toISOString(),
      isUserSubmitted: true,
    };

    addRecipe(newRecipe);
    setOpen(false);
    toast.success("✅ Recipe submitted!");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      ingredients: "",
      instructions: "",
      prepTime: "",
      servings: "",
      imageUrl: "",
      dietaryTags: [],
    });
    setErrors({});
  };

  const handleDietToggle = (diet) => {
    setFormData(prev => {
      const tags = prev.dietaryTags;
      return {
        ...prev,
        dietaryTags: tags.includes(diet) ? tags.filter(t => t !== diet) : [...tags, diet]
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Submit a Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1e1e1e]">
        <DialogHeader>
          <DialogTitle>Submit a Community Recipe</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Recipe Title *</label>
            <Input 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="E.g. Grandma's Apple Pie" 
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description *</label>
            <Textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="A short description of the recipe..." 
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Prep Time (mins) *</label>
              <Input 
                type="number" 
                min="1"
                value={formData.prepTime} 
                onChange={e => setFormData({...formData, prepTime: e.target.value})} 
              />
              {errors.prepTime && <p className="text-xs text-destructive">{errors.prepTime}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Servings *</label>
              <Input 
                type="number" 
                min="1"
                value={formData.servings} 
                onChange={e => setFormData({...formData, servings: e.target.value})} 
              />
              {errors.servings && <p className="text-xs text-destructive">{errors.servings}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Ingredients *</label>
            <Textarea 
              value={formData.ingredients} 
              onChange={e => setFormData({...formData, ingredients: e.target.value})} 
              placeholder="One ingredient per line" 
              className="min-h-[100px]"
            />
            {errors.ingredients && <p className="text-xs text-destructive">{errors.ingredients}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Instructions *</label>
            <Textarea 
              value={formData.instructions} 
              onChange={e => setFormData({...formData, instructions: e.target.value})} 
              placeholder="One step per line" 
              className="min-h-[100px]"
            />
            {errors.instructions && <p className="text-xs text-destructive">{errors.instructions}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dietary Tags</label>
            <div className="flex flex-wrap gap-4">
              {DIET_OPTIONS.map(diet => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`diet-${diet}`} 
                    checked={formData.dietaryTags.includes(diet.toLowerCase())}
                    onCheckedChange={() => handleDietToggle(diet.toLowerCase())}
                  />
                  <label htmlFor={`diet-${diet}`} className="text-sm cursor-pointer">{diet}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <Input 
              type="url"
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              placeholder="https://..." 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">Submit Recipe</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
